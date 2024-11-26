

class Shoes {
  int? pk;
  String? name;
  String? img;
  double? price;
  String? desc;
  double? newprice;
  int? promo;
  int? gender;
  String? brandName;
  String? brandImg;

  Shoes({this.pk, this.name, this.img, this.price, this.desc, this.newprice, this.promo, this.gender, this.brandName, this.brandImg});

  Shoes.fromJson(Map<String, dynamic> json)  {
    
    pk = json['pk'];
    name = json['name'];
    img = json['img'];
    price = json['price'];
    desc = json['desc'];
    newprice = json['newprice'];
    promo = json['promo'];
    gender = json['gender'];
    brandName = json['brand__name'];
    brandImg = json['brand__img'];
  }
}