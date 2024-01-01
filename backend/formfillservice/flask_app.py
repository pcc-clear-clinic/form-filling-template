import logging
import os
from flask import Flask
from formfillservice.endpoints import oeci_scrape
from formfillservice.endpoints import oeci_login


FRONTEND_BUILD_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "frontend", "dist"))

app = Flask(__name__, static_folder=FRONTEND_BUILD_DIR)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger("logger")
logger.info("app loaded")


@app.route("/health")
def hello_world():
    logger.info("called hello world")
    return "Hello world"

app.register_blueprint(oeci_scrape.bp)
app.register_blueprint(oeci_login.bp)


@app.route("/")
def blank(): 
    logger.info("called /")
    return "text: /"

@app.route("/blank")
def blank(): 
    logger.info("called blank")
    return "blank"

@app.route("/<path:path>", methods=["GET", "HEAD", "OPTIONS"])
def try_files_static_index(path):
    logger.info(f"serving file: {path}")

    static_path = os.path.join(app.static_folder, path)
    if os.path.exists(static_path) and not os.path.isdir(static_path):
        return app.send_static_file(path)
    else:
        return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run()
