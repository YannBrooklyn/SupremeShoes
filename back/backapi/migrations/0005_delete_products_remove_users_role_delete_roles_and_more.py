# Generated by Django 5.0.4 on 2024-04-29 12:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backapi', '0004_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Products',
        ),
        migrations.RemoveField(
            model_name='users',
            name='role',
        ),
        migrations.DeleteModel(
            name='Roles',
        ),
        migrations.DeleteModel(
            name='Users',
        ),
    ]
