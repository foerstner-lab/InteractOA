from wikidataintegrator.wdi_core import WDItemEngine
import pandas as pd
import urllib.parse

class WDReferencesFetcher:

    def __init__(self, QID):
        self.QID = QID

    def get_wd_label(self):
        query_file = open('Label_Fetch_Query.rq', 'r')
        query_template = query_file.read()
        QUERY = query_template
        QUERY = QUERY.replace("#QID#", self.QID)
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

    def get_interacted_RNA_references(self):
        interacted_RNA_references = []
        row_nums = 0
        query_file = open('ALL_INTERACTED_SRNA_QUERY.rq', 'r')
        query_template = query_file.read()
        query_file.close()
        QUERY = query_template
        QUERY = QUERY.replace("#QID#", self.QID)
        results = WDItemEngine.execute_sparql_query(QUERY)['results']['bindings']
        if len(results) != 0:
            for result in results:
                row_nums += 1
                tmp_quote = urllib.parse.quote(result['quote']['value'])
                pmc_url = f"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC{result['PMCID']['value']}#:~:text={tmp_quote}"
                pmc_url = pmc_url.replace('.', '%2E').replace('-', '%2D')
                interacted_RNA_references.append([row_nums,
                                                  result['rnaLabel']['value'],
                                                  result['propLabel']['value'],
                                                  result['targetLabel']['value'],
                                                  f"{result['quote']['value']}",
                                                  f'<div class="form-control"><a target="_blank" href="{pmc_url}"><img src="static/images/Logo_PMC.png" '
                                                  'title="Open source of the quote in PubMed Central" height="30px" class="rounded"></a></div>',
                                                  '<div class="form-control"><a target="_blank" href="'
                                                  f"{result['rna']['value']}"
                                                  '"><img src="static/images/Interact_logo_Wikidata.png" '
                                                  'title="View WikiData item" height="30px" class="rounded"></a></div>'])
        else:
            return "Query returns nothing."
        data_tbl_cols = ['#', 'sRNA', 'Type of Regulation', 'Target Gene', 'Quote', 'Quote from', 'WikiData']
        data_tbl_df = pd.DataFrame(interacted_RNA_references, columns=data_tbl_cols)
        pd.set_option('display.max_colwidth', None)
        data_tbl = data_tbl_df.to_html(index=False, escape=False, bold_rows=False, max_rows=None, max_cols=None,
                                       table_id="data_tbl", justify="center")
        data_tbl = data_tbl.replace('border="1" ', "")
        data_tbl = data_tbl.replace('class="dataframe" ',
                                    'class="display responsive no-wrap table" ')
        final_html = f"<div><h4>Referenced items: {self.get_wd_label()}</h4></div>{data_tbl}"
        return final_html
