"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app, db
from flask import render_template, request, redirect, url_for, flash, jsonify
import simplejson as json
from app.models import Firm
# import sqlite3

###
# Routing for your application.
###


@app.route('/')
def show_users():
    # or you could have used User.query.all()
    # users = db.session.query(User).all()
    parsedAmount = db.session.query(Firm).count()
    return render_template('index.html', parsedAmount=parsedAmount)

@app.route("/get-data")
def get_data():
    parsedAmount = db.session.query(Firm).all()
    result = []
    for row in parsedAmount:
        result.append(row.firmInfo)
    return "Data in for row in parsedAmount:"

@app.route("/firm/<firm_id>")
def get_firm(firm_id):
    firm = db.session.query(Firm).filter(Firm.firmId == firm_id)
    return render_template('firmInfo.html', table=firm[0].getPage())

@app.route("/firms")
def firms_list():
    firms = db.session.query(Firm).all()
    return render_template('firmList.html', firms=firms)

@app.route('/add_firm', methods=['POST'])
def add_user():

    if request.method == 'POST':
        requestJson = json.loads(request.data)
        print (request.data)
        if not requestJson:
            print ('No JSON', requestJson)
            return jsonify(success=False, error="Should be an array"), 400

        if not "firmInfo" in requestJson:
            print ('Firm Info not an array', requestJson["firmInfo"])
            return jsonify(success=False, error="Data is not an array"), 400

        if not ("firmId" in requestJson):
            print ('Firm ID not passed')
            return jsonify(success=False, error="ID is not supplied"), 400

        if not ("firmPage" in requestJson):
            print ('Firm Page not passed')
            return jsonify(success=False, error="Not Raw Page Data"), 400

        firm = Firm(str(requestJson["firmId"]), str(requestJson["firmInfo"]), str(requestJson["firmPage"]))


        db.session.add(firm)
        db.session.commit()

        print ('Successfully added firm:', requestJson["firmId"])
        return jsonify(success=True), 200
    
    return "Only 'POST' in supported"

###
# The functions below should be applicable to all Flask apps.
###


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
