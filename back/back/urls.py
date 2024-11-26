from django.urls import path
from rest_framework import routers

from backapi import views

router = routers.SimpleRouter(trailing_slash=False)
urlpatterns = [
    #### USERS
    path('users/get/users/all/', views.func_usersBis),
    path('users/get/users/<int:user_id>/', views.func_users),
    path('users/post/users/', views.func_usersBis),
    path('users/put/users/<int:user_id>/', views.func_users),
    path('users/delete/users/<int:user_id>/', views.func_users),
    path('users/login/users/', views.func_users_login),


    #### PRODUCTS

    path('products/get/products/all/', views.func_productsBis),
    path('products/get/products/<int:product_id>/', views.func_products),
    path('products/post/products/', views.func_productsBis),
    path('products/put/products/<int:product_id>/', views.func_products),
    path('products/delete/products/<int:product_id>/', views.func_products),
    path('products/get/products/all/flutter/', views.func_productsBisFlut),

    #### Roles

    path('roles/get/roles/all/', views.func_rolesBis),
    path('roles/get/roles/<int:role_id>/', views.func_roles),
    path('roles/post/roles/', views.func_rolesBis),
    path('roles/put/roles/<int:role_id>/', views.func_roles),
    path('roles/delete/roles/<int:role_id>/', views.func_roles),

    #### Brands

    path('brands/get/brands/all/', views.func_brandsBis),
    path('brands/get/brands/<int:brand_id>/', views.func_brands),
    path('brands/post/brands/', views.func_brandsBis),
    path('brands/put/brands/<int:brand_id>/', views.func_brands),
    path('brands/delete/brands/<int:brand_id>/', views.func_brands),

    #### Commandes

    path('commandes/get/commandes/all/', views.func_commandesBis),
    path('commandes/get/commandes/<int:commande_id>/', views.func_commandes),
    path('commandes/post/commandes/', views.func_commandesBis),
    path('commandes/put/commandes/', views.func_commandesBis),
    path('commandes/delete/commandes/<int:commande_id>/', views.func_commandes)
]