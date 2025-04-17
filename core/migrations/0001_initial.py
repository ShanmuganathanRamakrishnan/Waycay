# Generated by Django 5.2 on 2025-04-17 10:22

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('travel_type', models.CharField(blank=True, max_length=40, null=True)),
                ('preferred_region', models.CharField(blank=True, max_length=400, null=True)),
                ('acc_creation', models.DateField(default=django.utils.timezone.now)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Destination',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
                ('location', models.CharField(max_length=300)),
                ('region_type', models.CharField(blank=True, max_length=40, null=True)),
                ('visit_time', models.CharField(blank=True, max_length=40, null=True)),
                ('description', models.CharField(blank=True, max_length=400, null=True)),
                ('avg_cost', models.DecimalField(decimal_places=5, max_digits=15)),
            ],
            options={
                'constraints': [models.CheckConstraint(condition=models.Q(('avg_cost__gte', 0)), name='check_avg_cost')],
            },
        ),
        migrations.CreateModel(
            name='Hotspot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timings', models.CharField(blank=True, max_length=30, null=True)),
                ('rating', models.DecimalField(blank=True, decimal_places=2, max_digits=3, null=True)),
                ('hidden_gem', models.BooleanField(default=False)),
                ('description', models.CharField(blank=True, max_length=400, null=True)),
                ('hotspot_addr', models.CharField(blank=True, max_length=300, null=True)),
                ('destination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.destination')),
            ],
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('res_name', models.CharField(max_length=40)),
                ('cuisine_type', models.CharField(blank=True, max_length=40, null=True)),
                ('res_location', models.CharField(max_length=300)),
                ('avg_rating', models.DecimalField(blank=True, decimal_places=2, max_digits=3, null=True)),
                ('price_range', models.CharField(blank=True, max_length=20, null=True)),
                ('timings', models.CharField(blank=True, max_length=20, null=True)),
                ('res_type', models.CharField(blank=True, max_length=30, null=True)),
            ],
            options={
                'constraints': [models.CheckConstraint(condition=models.Q(('avg_rating__gte', 0), ('avg_rating__lte', 5)), name='check_avg_rating')],
            },
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('destination', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.destination')),
                ('hotspot', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.hotspot')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('restaurant', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.restaurant')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(blank=True, null=True)),
                ('comments', models.CharField(blank=True, max_length=400, null=True)),
                ('date', models.DateField()),
                ('destination', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.destination')),
                ('hotspot', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.hotspot')),
                ('restaurant', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.restaurant')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TripPlanner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('trip_name', models.CharField(max_length=30)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('budget', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TripPlannerDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visit_date', models.DateField()),
                ('notes', models.CharField(blank=True, max_length=350, null=True)),
                ('destination', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.destination')),
                ('hotspot', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.hotspot')),
                ('planner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.tripplanner')),
                ('restaurant', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.restaurant')),
            ],
        ),
        migrations.AddConstraint(
            model_name='hotspot',
            constraint=models.CheckConstraint(condition=models.Q(('rating__gte', 0), ('rating__lte', 5)), name='check_rating'),
        ),
        migrations.AddConstraint(
            model_name='review',
            constraint=models.CheckConstraint(condition=models.Q(('rating__gte', 1), ('rating__lte', 5)), name='check_review_rating'),
        ),
        migrations.AddConstraint(
            model_name='tripplanner',
            constraint=models.CheckConstraint(condition=models.Q(('start_date__lte', models.F('end_date'))), name='check_dates'),
        ),
        migrations.AddConstraint(
            model_name='tripplanner',
            constraint=models.CheckConstraint(condition=models.Q(('budget__gte', 0)), name='check_budget'),
        ),
    ]
