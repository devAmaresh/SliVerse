#!/bin/bash
pip install -r requirements.txt  # Install dependencies
python3.12 manage.py collectstatic --noinput  # Collect static files
