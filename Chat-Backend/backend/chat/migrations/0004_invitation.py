# Generated by Django 4.2.13 on 2024-05-28 10:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_conversation_message'),
    ]

    operations = [
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('iSender', models.IntegerField(db_column='iSender', default=0)),
                ('iReceiver', models.IntegerField(db_column='iReceiver', default=0)),
                ('iCreated', models.DateTimeField(auto_now_add=True, db_column='iCreated')),
                ('iUpdated', models.DateTimeField(auto_now=True, db_column='iUpdated')),
                ('iRead', models.BooleanField(db_column='iRead', default=False)),
                ('iStatus', models.CharField(db_column='iStatus', default='pending', max_length=50)),
            ],
        ),
    ]
