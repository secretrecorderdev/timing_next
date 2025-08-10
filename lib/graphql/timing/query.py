# graphql/timing/query.py

from typing import List

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.timing_list import TimingList
from app.graphql.timing.type import TimingListType
from app.graphql.timing.input import TimingListInput

def _fetch_timing_list(db: Session, input: TimingListInput) -> list[TimingListType]:
    q = db.query(TimingList)
    if input.buy_state is not None:
        q = q.filter(TimingList.buy_state == input.buy_state)
    if input.start_date and input.end_date:
        q = q.filter(TimingList.timing_date.between(input.start_date, input.end_date))
    q = q.order_by(TimingList.reg_date.desc()).offset(input.offset or 0).limit(input.limit or 20)
    return [TimingListType(model=row) for row in q.all()]