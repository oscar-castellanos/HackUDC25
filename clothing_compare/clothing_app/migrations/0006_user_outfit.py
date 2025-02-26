# Generated by Django 5.1.6 on 2025-02-22 16:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clothing_app', '0005_clothing_detail_color_clothing_detail_composition_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='User_outfit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=100)),
                ('accesory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accesory', to='clothing_app.clothing_detail')),
                ('bottom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bottom', to='clothing_app.clothing_detail')),
                ('shoes', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shoes', to='clothing_app.clothing_detail')),
                ('top', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='top', to='clothing_app.clothing_detail')),
            ],
        ),
    ]
