from flask import Flask, render_template, request, jsonify
from WDQueryGenerator import *
from WDReferencesFetcher import *
from flask_cors import CORS
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup


app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template(path)


@app.route('/fetch_references')
def fetch_references():
    organism_QID = request.args.get('organism_qid', default=None, type=None)
    return jsonify(results=WDReferencesFetcher(organism_QID).get_interacted_RNA_references())


@app.route('/Article_Viewer.html')
def fetch_article():
    pmcid = request.args.get('pmcid', default=None, type=None)
    head_src, article_body = get_article(pmcid)
    return render_template("Article_Viewer.html", article_body=article_body, head_src=head_src)


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


def get_article(pmcid):
    base_url = "https://pmc.ncbi.nlm.nih.gov/articles/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'}
    req = Request(f"{base_url}{pmcid}", headers=headers)
    content = urlopen(req).read().decode("utf-8")
    replacements = {
        'content="/': 'content="https://pmc.ncbi.nlm.nih.gov/',
        'href="//doi.org': 'href="https://www.doi.org',
        'href="/': 'href="https://pmc.ncbi.nlm.nih.gov/',
        'src="/': 'src="https://pmc.ncbi.nlm.nih.gov/',
        "url(/corehtml/pmc/pmcgifs": "url(https://pmc.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs"}
    for k, v in replacements.items():
        content = content.replace(k, v)
    soup = BeautifulSoup(content, "html.parser")
    return soup.find("head"), soup.find("main", {"id": "main-content"})


if __name__ == '__main__':
    app.run(debug=True)

