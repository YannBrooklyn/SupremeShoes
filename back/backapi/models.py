from django.db import models


class Roles(models.Model):
    name = models.CharField(max_length=50)

class Users(models.Model):
    username = models.CharField(max_length = 20)
    email = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    adress = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    role = models.ForeignKey(Roles, related_name="role", on_delete=models.CASCADE) 

class Brands(models.Model):
    name = models.CharField(max_length=200)
    img = models.CharField(max_length=250)

class Products(models.Model):
    name = models.CharField(max_length=200)
    price = models.FloatField()
    img = models.CharField(max_length=250)
    desc = models.CharField(max_length=250, default="...")
    newprice = models.FloatField(default=0.00)
    promo = models.SmallIntegerField(default=2)
    brand = models.ForeignKey(Brands,related_name="brand", on_delete=models.CASCADE, default=1)
    gender = models.SmallIntegerField(default=3)

class Commandes(models.Model):
    isDelivred = models.BooleanField(default=False)
    isCommanded = models.BooleanField(default=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    user = models.ForeignKey(Users,related_name="user", on_delete=models.CASCADE)
