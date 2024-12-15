#!/bin/bash
python3.12 -m pip install --upgrade pip  # Upgrade pip
python3.12 -m pip install -r requirements.txt  # Install dependencies
python3.12 manage.py collectstatic --noinput  # Collect static files
