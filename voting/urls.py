from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import viewsets, routers

from voting_app.models import Topic
from voting_app.views import Vote
from voting_app.serializer import TopicSerializer

admin.autodiscover()


# ViewSets define the view behavior.
class TopicViewSet(viewsets.ModelViewSet):
    model = Topic
    serializer_class = TopicSerializer
    queryset = Topic.objects.all().filter(hide=False)

router = routers.DefaultRouter()
router.register(r'topics', TopicViewSet)

urlpatterns = patterns('',
    url(r'^$', 'voting_app.views.index', name='index'),
    url(r'^', include(router.urls)),
    url(r'^vote/$', Vote.as_view()),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    url(r'^admin/', include(admin.site.urls)),
)
