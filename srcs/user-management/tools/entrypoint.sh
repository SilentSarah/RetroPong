python manage.py collectstatic --noinput
./manage.py shell -c "from django.contrib.sites.models import Site ; Site.objects.create(domain='$HOST_ADDRESS', name='$HOST_ADDRESS')" > /dev/null 2>&1
exec daphne -e ssl:$USERMGR_PORT:privateKey=$HOST_ADDRESS.key:certKey=$HOST_ADDRESS.crt -b 0.0.0.0 UserManagement.asgi:application
