from flask import Flask, render_template, request, jsonify
from WDQueryGenerator import *
from WDReferencesFetcher import *
from flask_cors import CORS

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

