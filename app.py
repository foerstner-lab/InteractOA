from flask import *
from wikidataintegrator.wdi_core import WDItemEngine
import pandas as pd
import HTML
import urllib.parse


def get_wd_label(QID):
    query_file = open('Label_Fetch_Query.rq', 'r')
    query_template = query_file.read()
    QUERY = query_template
    QUERY = QUERY.replace("#QID#", QID)
    results = WDItemEngine.execute_sparql_query(QUERY)['results']['bindings']
    item = ""
    if len(results) == 0:
        print("Query returns no items for the specified Q-ID.")
    elif len(results) == 1:
        for result in results:
            item = result['label']['value']
    else:
        print("Query returns more that Item for the same Q-ID.")
    query_file.close()
    return item


def get_sRNA__QID_list(QID):
    query_file = open('ALL_SRNA_QUERY.rq', 'r')
    query_template = query_file.read()
    QUERY = query_template
    QUERY = QUERY.replace("#QID#", QID)
    results = WDItemEngine.execute_sparql_query(QUERY)['results']['bindings']
    sRNA_QID_list = []
    if len(results) != 0:
        for result in results:
            if 'target' in result:
                if str(result['rna']['value']).replace("http://www.wikidata.org/entity/", "") not in sRNA_QID_list:
                    sRNA_QID_list.append(str(result['rna']['value']).replace("http://www.wikidata.org/entity/", ""))
    else:
        print("Query returns nothing.")
    return sRNA_QID_list


def get_HTML_cited_QID(sRNA_QID_list, Organism_QID):
    r_list = []
    REG_PROP_df = pd.read_csv('REGULATORY_PROPERTIES.CSV', sep=',', names=['PROPERTY', 'PROPERTY_LABEL'])
    query_file = open('QUERY.rq', 'r')
    query_template = query_file.read()
    for sRNA_QID in sRNA_QID_list:
        for index, row in REG_PROP_df.iterrows():
            QUERY = query_template
            QUERY = QUERY.replace("#SRNA_QID#", sRNA_QID)
            QUERY = QUERY.replace("#REG_PROPERTY#", row['PROPERTY'])
            results = WDItemEngine.execute_sparql_query(QUERY)['results']['bindings']
            if len(results) != 0:
                for result in results:
                    if 'PMCID' in result:
                        r_list.append([get_wd_label(sRNA_QID),
                                       row['PROPERTY_LABEL'],
                                       result['geneLabel']['value'],
                                       '<a href="Article_Viewer.html?article_PMCID=' + result['PMCID']['value'] +
                                       '&quote=' + urllib.parse.quote_plus(result['quote']['value']) +
                                       '">Read the article</a>', result['quote']['value']])
    data_tbl = HTML.table(r_list, header_row=['sRNA', 'Type of Regulation', 'Target Gene', 'Article Link', 'Quote'])
    final_html = "<div><h2>Referenced items: " + get_wd_label(Organism_QID) + "</h2></div>" + data_tbl
    return final_html


def run_script(organism_QID):
    sRNA_QID_list = get_sRNA__QID_list(organism_QID)
    htmlcode = get_HTML_cited_QID(sRNA_QID_list, organism_QID)
    return htmlcode


app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template(path)


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/python_func')
def return_cited_table():
    organism_QID = request.args.get('organism_qid', default=None, type=None)
    return jsonify(results=run_script(organism_QID))


if __name__ == '__main__':
    app.run(debug=True)

