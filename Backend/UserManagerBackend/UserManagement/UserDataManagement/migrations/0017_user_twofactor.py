# Generated by Django 4.2.13 on 2024-06-02 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserDataManagement', '0016_alter_user_uprofilebgpic_alter_user_uprofilepic'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='TwoFactor',
            field=models.BooleanField(db_column='TwoFactor', default=False),
        ),
    ]