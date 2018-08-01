from flask import *
from wikidataintegrator.wdi_core import WDItemEngine
import urllib.parse
from WDQueryGenerator import *
import pandas as pd


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

def get_interacted_RNA_references(QID):
    interacted_RNA_references = []
    row_nums = 0
    query_file = open('ALL_INTERACTED_SRNA_QUERY.rq', 'r')
    query_template = query_file.read()
    query_file.close()
    QUERY = query_template
    QUERY = QUERY.replace("#QID#", QID)
    src_img = "{{url_for('.static', filename='images/Interact_logo_Wikidata.png')}}"
    results = WDItemEngine.execute_sparql_query(QUERY)['results']['bindings']
    if len(results) != 0:
        for result in results:
            row_nums += 1
            interacted_RNA_references.append([row_nums, result['rnaLabel']['value'], result['propLabel']['value'],
                                              result['targetLabel']['value'],

                                              result['quote']['value'] +
                                              '</br><a target="_self" href="Article_Viewer.html?article_PMCID=' +
                                              result['PMCID']['value'] +
                                              '&quote=' + urllib.parse.quote_plus(result['quote']['value']) +
                                              '">Read this in the article</a>',
                                                  '<div class="form-control"><a target="_blank" href="' +
                                              result['rna']['value'] +
                                              '"><img src="static/images/Interact_logo_Wikidata.png"' +
                                              ' height="30px" class="rounded"></a></div>'])
    else:
        return "Query returns nothing."
    data_tbl_cols = ['#', 'sRNA', 'Type of Regulation', 'Target Gene', 'Quote', 'Source']
    data_tbl_df = pd.DataFrame(interacted_RNA_references, columns=data_tbl_cols)
    pd.set_option('display.max_colwidth', -1)
    data_tbl = data_tbl_df.to_html(index=False, escape=False, bold_rows=False, max_rows=None, max_cols=None,
                                   table_id="data_tbl", justify="center")
    data_tbl = data_tbl.replace('border="1" ',"")
    data_tbl = data_tbl.replace('class="dataframe" ',
                                'class="display responsive no-wrap" style="font-family: Courier New; font-size: 13px;"')
    final_html = "<div><h4>Referenced items: " + get_wd_label(QID) + '</h4></div>' + data_tbl
    return final_html

def run_script(organism_QID):
    return get_interacted_RNA_references(organism_QID)


app = Flask(__name__, static_url_path='/static')


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


@app.route('/generate_viewer_query')
def return_viewer_query():
    organism_qid = request.args.get('organism_qid', default=None, type=None)
    view_type = request.args.get('view_type', default=None, type=None)
    filters = request.args.get('filters', default=None, type=None)
    shows = request.args.get('shows', default=None, type=None)
    words = request.args.get('words', default=None, type=None)
    is_interacted = request.args.get('is_interacted', default=None, type=None)
    only_no_interacted = request.args.get('only_no_interacted', default=None, type=None)
    query = WDQueryGenerator(organism_qid, view_type, filters, shows, words, is_interacted,
                             only_no_interacted).generate_query()
    return jsonify(results=query)


if __name__ == '__main__':
    app.run(debug=False)

