import os
import logging
from flask import Flask
from formfillservice.endpoints import oeci

app = Flask(__name__)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
from flask_cors import CORS

CORS(app)

logger = logging.getLogger("logger")
logger.info("app loaded")


@app.route("/health")
def hello_world():
    logger.info("called hello world")
    return "Hello world"


app.register_blueprint(oeci.bp)
if __name__ == "__main__":
    app.run()
