# Generated by Django 4.1.1 on 2022-12-07 13:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('advertisements', '0005_chat_alter_photo_options_alter_advert_charvalues_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='advert',
            options={'ordering': ('-date',), 'verbose_name': 'Объявление', 'verbose_name_plural': 'Объявления'},
        ),
        migrations.AlterModelOptions(
            name='chat',
            options={'verbose_name': 'Чат', 'verbose_name_plural': 'Чаты'},
        ),
        migrations.AddField(
            model_name='chat',
            name='seller',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='sell_chats', to=settings.AUTH_USER_MODEL, verbose_name='Продавец'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='chat',
            name='advert',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='chats', to='advertisements.advert', verbose_name='Объявление'),
        ),
        migrations.AlterField(
            model_name='chat',
            name='buyer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='buy_chats', to=settings.AUTH_USER_MODEL, verbose_name='Покупатель'),
        ),
    ]
