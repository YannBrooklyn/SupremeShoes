class Brands {
  int? pk;
  String? name;
  String? img;

  Brands({this.pk, this.name, this.img});

  Brands.fromJson(Map<String, dynamic> json)  {
    
    pk = json['pk'];
    name = json['fields']['name'];
    img = json['fields']['img'];
  }
}