# Generated by Django 4.2.13 on 2024-05-19 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserDataManagement', '0007_user_level_user_udiscordid_user_utitle_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='level',
            field=models.IntegerField(db_column='level', default=0),
        ),
    ]