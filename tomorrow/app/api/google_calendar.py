import gdata.gauth
import gdata.auth
import gdata.calendar.data
import gdata.calendar.client
import gdata.calendar.service


def GetAuthSubUrl():
  #next = 'http://localhost:3000/api_import/google_calendar'
  next = 'http://localhost:3000/home/trial'
  scope = 'http://www.google.com/calendar/feeds/'
  secure = False  # set secure=True to request a secure AuthSub token
  session = True
  return gdata.gauth.generate_auth_sub_url(next, scope, secure=secure, session=session)

#print '%s' % GetAuthSubUrl()


def print_user_calendar(current_url):
  current_url = "http://localhost:3000/home/trial?auth_sub_scopes=http%3A%2F%2Fwww.google.com%2Fcalendar%2Ffeeds%2F&token=1%2FtGkRSNKIYUcSLD0OT73WxCSs0RNbfnJO5LatX6fTmuY"

  single_use_token = gdata.auth.extract_auth_sub_token_from_url(current_url)

  calendar_service = gdata.calendar.service.CalendarService()
  #calendar_service.UpgradeToSessionToken(single_use_token)  # calls gdata.service.SetAuthSubToken() for you
  calendar_service.SetAuthSubToken("1/LsoU1QNzLzoyFQoR7iacoQjakb3QFta7OAn0ixJUAT4")
  import pdb; pdb.set_trace()
  feed = calendar_service.GetCalendarEventFeed()

  print 'Events on Primary Calendar: %s' % (feed.title.text,)
  for i, an_event in zip(xrange(len(feed.entry)), feed.entry):
    print '\t%s. %s' % (i, an_event.title.text,)
    for p, a_participant in zip(xrange(len(an_event.who)), an_event.who):
      print '\t\t%s. %s' % (p, a_participant.email,)
      print '\t\t\t%s' % (a_participant.value,)
      if a_participant.attendee_status:
        print '\t\t\t%s' % (a_participant.attendee_status.value,)
        
  token_info = calendar_service.AuthSubTokenInfo()
  calendar_service.RevokeAuthSubToken()

  print token_info




print_user_calendar("")
