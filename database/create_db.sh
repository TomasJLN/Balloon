#!/bin/bash
mysql -u demo -p < ./database/create_db.sql

echo $?