FROM node:16.15.1 as build

WORKDIR /frontend

COPY frontend/package*.json /frontend/
RUN npm install
COPY frontend /frontend

RUN npm run build


FROM python:3.11.4-slim-bookworm


COPY --from=build /frontend/dist /frontend/dist

RUN apt-get update \
    && apt-get install -y libpq-dev gcc \
    && apt-get clean

ENV PYTHONUNBUFFERED True
ENV AZ_APP_USERS $AZ_APP_USERS
ENV JWT_SECRET_KEY $JWT_SECRET_KEY
ENV ENV_NAME=$ENV_NAME

WORKDIR /app

COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app
CMD exec gunicorn --workers 1 --threads 8 --timeout 0 --reload formfillservice.flask_app:app
