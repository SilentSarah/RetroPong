# Generated by Django 4.2.13 on 2024-05-19 17:02

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserDataManagement', '0009_alter_user_rank'),
    ]

    operations = [
        migrations.CreateModel(
            name='MatchHistory',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('fOpponent', models.IntegerField(db_column='fOpponent', default=-1)),
                ('sOpponent', models.IntegerField(db_column='sOpponent', default=-1)),
                ('tOpponent', models.IntegerField(db_column='tOpponent', default=-1)),
                ('lOpponent', models.IntegerField(db_column='lOpponent', default=-1)),
                ('mStartDate', models.DateTimeField(db_column='mStartDate', default='')),
                ('Score', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), db_column='Score', size=None)),
                ('Winners', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), db_column='Winners', size=None)),
            ],
        ),
    ]
