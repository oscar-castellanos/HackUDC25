# Generated by Django 5.1.6 on 2025-02-22 09:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('clothing_app', '0002_clothing_detail_user_clothing_delete_react'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user_clothing',
            name='image_id',
        ),
    ]
