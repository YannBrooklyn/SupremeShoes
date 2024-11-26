class Users {
  int? pk;
  String? username;
  String? email;
  String? password;
  String? adress;
  String? city;
  String? country;
  int? roleId;

  Users({this.pk, this.username, this.email, this.password, this.adress, this.city, this.country, this.roleId});

  Users.fromJson(Map<String, dynamic> json) {
    pk = json['pk'];
    username = json['fields']['username'];
    email = json['fields']['email'];
    password = json['fields']['password'];
    adress = json['fields']['adress'];
    city = json['fields']['city'];
    country = json['fields']['country'];
    roleId= json['fields']['roleId'];
  }
}