# Generated by Django 4.2.13 on 2024-06-08 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Authentication', '0003_users_uis42'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='uProfilebgpic',
        ),
        migrations.RemoveField(
            model_name='users',
            name='uProfilepic',
        ),
        migrations.AddField(
            model_name='users',
            name='TwoFactor',
            field=models.BooleanField(db_column='TwoFactor', default=False),
        ),
    ]
