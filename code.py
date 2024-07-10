from sqlalchemy import func, select, outerjoin, literal

# Define a function to handle date truncation based on aggregation period
def get_date_trunc_func(aggregation_period):
  if aggregation_period == 'WEEKLY':
    return func.date_trunc('week')
  elif aggregation_period == 'DAILY':
    return func.date_trunc('day')
  else:
    return func.date_trunc('month')

# Define the date ranges
start_date = datetime.date(year=2024, month=6, day=2)
end_date = datetime.date(year=2024, month=7, day=9)

if request.aggregationPeriod == 'WEEKLY':
  # Weekly Aggregation

  date_trunc_func = get_date_trunc_func(request.aggregationPeriod)

  aggregated_data = (
      select(
          date_trunc_func(Conversation.createdAt).label('period'),
          func.count(Conversation.id).label('count')
      )
      .from_(Conversation)
      .where(Conversation.createdAt >= start_date)
      .where(Conversation.createdAt <= end_date)
      .group_by(date_trunc_func(Conversation.createdAt))
      .alias('aggregated_data')
  )

  all_weeks = (
      select(
          date_trunc_func(start_date) + (func.generate_series(0, (func.extract(func.epoch, date_trunc_func(end_date) - date_trunc_func(start_date)) / 604800)) * interval('1 week')).label('week_start')
      ).from_(func.generate_series(0, (func.extract(func.epoch, date_trunc_func(end_date) - date_trunc_func(start_date)) / 604800)).alias('gs(n)'))
      .alias('all_weeks')
  )

  query = (
      select(
          all_weeks.c.week_start.label('timestamp'),
          func.coalesce(aggregated_data.c.count, 0).label('value')
      )
      .from_(all_weeks)
      .outerjoin(aggregated_data, all_weeks.c.week_start == aggregated_data.c.period)
      .order_by(all_weeks.c.week_start)
  )

elif request.aggregationPeriod == 'DAILY':
  # Daily Aggregation

  start_date = datetime.date(year=2024, month=7, day=2)
  end_date = datetime.date(year=2024, month=7, day=9)

  date_trunc_func = get_date_trunc_func(request.aggregationPeriod)

  aggregated_data = (
      select(
          date_trunc_func(Conversation.createdAt).label('period'),
          func.count(Conversation.id).label('count')
      )
      .from_(Conversation)
      .where(Conversation.createdAt >= start_date)
      .where(Conversation.createdAt <= end_date)
      .group_by(date_trunc_func(Conversation.createdAt))
      .alias('aggregated_data')
  )

  all_dates = (
      select(
          start_date + (n || ' days')::interval AS date
      ).from_(func.generate_series(0, end_date - start_date, 1) .alias('gs(n)'))
      .alias('all_dates')
  )

  query = (
      select(
          date_trunc_func(all_dates.date).label('timestamp'),
          func.coalesce(ad.count, 0).label('value')
      )
      .from_(all_dates)
      .outerjoin(aggregated_data, date_trunc_func(ad.period) == all_dates.date)
      .order_by(all_dates.date)
  )

else:
  # Monthly Aggregation

  date_trunc_func = get_date_trunc_func(request.aggregationPeriod)

  aggregated_data = (
      select(
          date_trunc_func(Conversation.createdAt).label('period'),
          func.count(Conversation.id).label('count')
      )
      .from_(Conversation)
      .where(Conversation.createdAt >= start_date)
      .where(Conversation.createdAt <= end_date)
      .group_by(date_trunc_func(Conversation.createdAt))
      .alias('aggregated_data')
  )

  all_months = (
      select(
          date_trunc_func(start_date) + (func.generate_series(0, (func.extract(YEAR FROM age(literal(end_date), literal(start_date))) * 12 + func.extract(MONTH FROM age(literal(end_date), literal(start_date))))::int) * interval('1 month')).label('month_start')
      ).from_(func.generate_series(0, (func.extract(YEAR FROM age(literal(end_date), literal(start_date))) * 12 + func.extract(MONTH FROM age(literal(end_date), literal(start_date))))::int) .alias('gs(n)'))
      .alias('all_months')
  )

  query = (
      select(
          all_months.c.month_start.label('timestamp'),
          func.coalesce(aggregated_data.c.count, 0).label('value')
      )
      .from_(all_months)
      .outerjoin(aggregated_data, all_months.c.month_start == aggregated_data.c.period)
      .order_by(all_months.c.month_start)
  )

# Execute the query (assuming you have a session object)
result = session.execute(query).fetchall()

# Process the results as needed
