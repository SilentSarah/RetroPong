# Generated by Django 4.2.11 on 2024-05-01 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Authentication', '0002_rename_udesc_users_udesc_rename_uemail_users_uemail_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='uIs42',
            field=models.BooleanField(db_column='uIs42', default=False),
        ),
    ]