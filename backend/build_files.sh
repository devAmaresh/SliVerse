#!/bin/bash
python3.12 -m install -r requirements.txt
python3.12 manage.py collectstatic
