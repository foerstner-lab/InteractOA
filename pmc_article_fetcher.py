from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options

class PMCArticleFetcher:
    def __init__(self, PMC_ID: str, quote: str):
        self._PMC_ID = PMC_ID
        self._quote = quote

    def get_PMC_article_source(self):
        base_url = "https://www.ncbi.nlm.nih.gov/pmc/articles/"

        options = webdriver.FirefoxOptions()
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-gpu")
        options.add_argument("--headless")
        #options.binary_location = "/home/muhoss/miniconda3/envs/interactoa_venv/bin/FirefoxApp/firefox"
        #driver = webdriver.Firefox(service=Service("/home/muhoss/miniconda3/envs/interactoa_venv/bin/geckodriver"), options=options)
        driver = webdriver.Firefox(options=options)
        #firefox_options.add_argument("--no-sandbox") # linux only
        #firefox_options.add_argument("--start-maximized")
        driver.get(f"{base_url}{self._PMC_ID}")
        article_source = driver.execute_script("return document.getElementById('mc').outerHTML;")
        head_source = driver.execute_script("return document.getElementsByTagName('head')[0].innerHTML;")
        driver.quit()
        return article_source, head_source

    def fetch_article(self):
        article_body_src, head_src = self.get_PMC_article_source()
        article_body_src = article_body_src.replace('href="//doi.org', 'href="https://www.doi.org')
        article_body_src = article_body_src.replace('href="/', 'href="https://www.ncbi.nlm.nih.gov/')\
            .replace('src="/', 'src="https://www.ncbi.nlm.nih.gov/')
        head_src = head_src.replace('href="/', 'href="https://www.ncbi.nlm.nih.gov/')\
            .replace('src="/',  'src="https://www.ncbi.nlm.nih.gov/')
        head_src = head_src.replace("url(/corehtml/pmc/pmcgifs",
                                    "url(https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs")
        return article_body_src, head_src
