# Generated by Django 4.2.13 on 2024-06-03 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserDataManagement', '0013_user_ablocked_user_ablockedby_user_afriends_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='TwoFactor',
            field=models.BooleanField(db_column='TwoFactor', default=False),
        ),
    ]
