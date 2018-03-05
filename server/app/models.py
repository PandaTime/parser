from app import db


class Firm(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firmId = db.Column(db.String())
    firmInfo = db.Column(db.String())
    firmPage = db.Column(db.String())

    def __init__(self, firmId, firmInfo, firmPage):
        self.firmId = firmId
        self.firmInfo = firmInfo
        self.firmPage = firmPage

    def __repr__(self):
        return '<firmId %r>' % self.firmId
    
    def getPage(self):
        return self.firmPage
