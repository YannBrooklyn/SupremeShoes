class Commands {
  int? pk;
  bool? isDelivred;
  bool? isCommanded;
  int? productId;
  int? userId;
  String? productImg;
  String? productName;
  double? productPrice;
  int? productPromo;
  double? productNewPrice;

  Commands({this.pk, this.productImg, this.productName, this.productPrice, this.productPromo, this.productNewPrice, this.productId, this.isDelivred, this.isCommanded, this.userId});

  Commands.fromJson(Map<String, dynamic> json)  {
    
    pk = json['pk'];
    isDelivred = json['fields']['isDelivred'];
    isCommanded = json['fields']['isCommanded'];
    productId = json['fields']['product_id'];
    productImg = json['fields']['product__img'];
    productName = json['fields']["product__name"];
    productPrice = json['fields']["product__price"];
    productPromo = json['fields']["product__promo"];
    productNewPrice = json['fields']["product__newprice"];
    userId = json['fields']['user_id'];
  }
}