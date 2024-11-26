class ShoesBis {
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

  ShoesBis({this.pk, this.name, this.img, this.price, this.desc, this.newprice, this.promo, this.gender, this.brandName, this.brandImg});

  ShoesBis.fromJson(Map<String, dynamic> json)  {
    
    pk = json['pk'];
    name = json['fields']['name'];
    img = json['fields']['img'];
    price = json['fields']['price'];
    desc = json['fields']['desc'];
    newprice = json['fields']['newprice'];
    promo = json['fields']['promo'];
    gender = json['fields']['gender'];
    brandName = json['fields']['brand__name'];
    brandImg = json['fields']['brand__img'];
  }
}