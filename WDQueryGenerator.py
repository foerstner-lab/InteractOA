class WDQueryGenerator:
    def __init__(self, organism_qid, view_type, filters, shows, words, is_interacted, only_no_interacted):
        self.organism_qid = organism_qid
        self.view_type = view_type
        self.filters = filters.split(",")
        self.shows = shows.split(",")
        self.words = words
        self.is_interacted = is_interacted
        self.only_no_interacted = only_no_interacted

    def generate_query(self):
        search_words_list = list(set(self.words.split(" ")))
        query_search_statement = ""
        search_exp = 'CONTAINS(LCASE(?rnaLabel), LCASE("#WORD#")) || CONTAINS(LCASE(?rnaAltLabel),  LCASE("#WORD#"))'
        generated_query = ""
        query_header = 'SELECT DISTINCT ?rna ?rnaLabel ("FFA500" as ?rgb) ?rnaAltLabel ?targetgene' + \
                          '?targetgeneLabel ?targetgeneAltLabel WHERE{\n'
        query_tail = 'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}\n}'
        filters_len = len(self.filters)
        query_filters = "?rna wdt:P703 wd:" + self.organism_qid + ".\n{\n"
        for index, fltr in enumerate(self.filters):
            query_filters += f"{{?rna wdt:P31 wd:{fltr}.}}\n"
            query_filters += "UNION\n"
            query_filters += f"{{?rna wdt:P279 wd:{fltr}.}}\n"
            if filters_len != index + 1:
                query_filters += "UNION\n"
        query_filters += "}\n"
        shows_len = len(self.shows)
        query_shows = "{\n"
        for index, show in enumerate(self.shows):
            query_shows += f"{{?rna wdt:{show}?targetgene.}}\n"
            if shows_len != index + 1:
                query_shows += "UNION\n"
        query_shows += "}\n"
        if self.is_interacted == "optional" and self.only_no_interacted != "only_query_headerno_interacted":
            query_shows = f"OPTIONAL {query_shows}"
        elif self.only_no_interacted == "only_no_interacted" and self.is_interacted != "optional":
            query_shows = f"FILTER NOT EXISTS {query_shows}"
        for empty_word in search_words_list:
            if empty_word == "":
                del empty_word
        search_words_list_len = len(search_words_list)
        if search_words_list:
            for index, search_word in enumerate(search_words_list):
                if search_word != "":
                    query_search_statement += search_exp.replace("#WORD#", search_word)
                    if search_words_list_len != index + 1:
                        query_search_statement += "\n||\n"
        generated_query = query_header + query_filters + query_shows + query_tail
        if query_search_statement != "":
            query_search_statement = f"FILTER({query_search_statement})\n"
            generated_query = f"{query_header}{{{generated_query}}}\n{query_search_statement}}}"
        generated_query = f"#defaultView:{self.view_type}\n{generated_query}"
        return generated_query
