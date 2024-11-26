import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_launcher_icons/xml_templates.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:supremeshoes/models/brands.dart';
import 'package:supremeshoes/models/commands.dart';
import "dart:convert";
import 'package:supremeshoes/models/shoes.dart';
import 'package:supremeshoes/models/shoesbis.dart';
import 'package:supremeshoes/models/users.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart' as jwt;

const host = "172.16.24.56";
const thePort = "8000";

void main() {
  runApp(MaterialApp(
    title: "Supreme Shoes",
    initialRoute: "/",
    routes: {
      "/": (context) => const HomePage(),
      "/category": (context) => const CategoryPage(),
      "/login": (context) => const LoginPage(),
      "/category/chaussures": (context) => const ShoesGenderPage(),
      "/category/chaussures/product": (context) => const TheShoesPage(),
      "/shop": (context) => const ShopPage(),
    },
  ));
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    const aTitle = "Supreme Shoes";

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          aTitle,
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.black,
      ),
      body: const Center(
        child: Column(
          children: [
            NewestShoes(),
            AllBrands(),
            PromoShoes(),
            Spacer(),
            MyNavigatorBar(),
          ],
        ),
      ),
    );
  }
}

class ScreenArguments {
  final int gender;

  ScreenArguments(this.gender);
}

class NewestShoes extends StatefulWidget {
  const NewestShoes({super.key});

  @override
  State<NewestShoes> createState() => NewestShoesState();
}

class NewestShoesState extends State<NewestShoes> {
  Future<List<Shoes>> shoesFuture = fetchShoes();

  static Future<List<Shoes>> fetchShoes() async {
    final res = await http.get(
        Uri.parse("http://$host:$thePort/products/get/products/all/flutter/"),
        headers: {"Content-type": "application/json"});

    final List myRes = json.decode(res.body);
    return myRes.map((e) => Shoes.fromJson(e)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FutureBuilder<List<Shoes>>(
        future: shoesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.hasData) {
            final shoes = snapshot.data!;
            return buildShoes(shoes);
          } else {
            return const Text(
              "No data",
              style: TextStyle(color: Colors.black),
            );
          }
        },
      ),
    );
  }

  Widget buildShoes(List<Shoes> shoes) {
    return Column(
      children: [
        const Text("Nouveauté"),
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 200,
                width: double.infinity,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: shoes.length,
                  itemBuilder: (context, index) {
                    final shoe = shoes[index];
                    return Column(
                      children: [
                        Image.network(
                          shoe.img!,
                          height: 150,
                          width: 150,
                        ),
                        Text(shoe.name!),
                        Text("€${shoe.price.toString()}"),
                      ],
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class AllBrands extends StatefulWidget {
  const AllBrands({super.key});

  @override
  State<AllBrands> createState() => AllBrandsState();
}

class AllBrandsState extends State<AllBrands> {
  Future<List<Brands>> brandsFuture = fetchBrands();

  static Future<List<Brands>> fetchBrands() async {
    final res = await http.get(
        Uri.parse("http://$host:$thePort/brands/get/brands/all/"),
        headers: {"Content-type": "application/json"});
    final List myRes = json.decode(res.body);
    return myRes.map((e) => Brands.fromJson(e)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FutureBuilder<List<Brands>>(
        future: brandsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.hasData) {
            final brands = snapshot.data!;
            return buildBrands(brands);
          } else {
            return const Text(
              "No data",
              style: TextStyle(color: Colors.black),
            );
          }
        },
      ),
    );
  }

  Widget buildBrands(List<Brands> brands) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: Container(
                decoration: const BoxDecoration(color: Colors.black),
                child: SizedBox(
                  height: 200,
                  width: double.infinity,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: brands.length,
                    itemBuilder: (context, index) {
                      final brand = brands[index];
                      return Image.network(
                        brand.img!,
                        height: 150,
                        width: 150,
                      );
                    },
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class PromoShoes extends StatefulWidget {
  const PromoShoes({super.key});

  @override
  State<PromoShoes> createState() => PromoShoesState();
}

class PromoShoesState extends State<PromoShoes> {
  Future<List<Shoes>> shoesFuture = fetchShoes();

  static Future<List<Shoes>> fetchShoes() async {
    final res = await http.get(
        Uri.parse("http://$host:$thePort/products/get/products/all/flutter/"),
        headers: {"Content-type": "application/json"});
    final List myRes = json.decode(res.body);
    return myRes.map((e) => Shoes.fromJson(e)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FutureBuilder<List<Shoes>>(
        future: shoesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.hasData) {
            final shoes = snapshot.data!;
            return buildShoes(shoes);
          } else {
            return const Text(
              "No data",
              style: TextStyle(color: Colors.black),
            );
          }
        },
      ),
    );
  }

  Widget buildShoes(List<Shoes> shoes) {
    return Column(
      children: [
        const Text("Promotion"),
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 200,
                width: double.infinity,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: shoes.length,
                  itemBuilder: (context, index) {
                    final shoe = shoes[index];
                    if (shoe.promo == 1) {
                      return Column(
                        children: [
                          Image.network(
                            shoe.img!,
                            height: 150,
                            width: 150,
                          ),
                          Text(shoe.name!),
                          Row(
                            children: [
                              Text(
                                "€${shoe.price.toString()}",
                                style: const TextStyle(
                                    decoration: TextDecoration.lineThrough,
                                    decorationColor: Colors.red),
                              ),
                              Text(" €${shoe.newprice.toString()}")
                            ],
                          ),
                        ],
                      );
                    } else {
                      return const Text("");
                    }
                  },
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});
  @override
  RegisterPageState createState() => RegisterPageState();
}

class RegisterPageState extends State<RegisterPage> {
  TextEditingController usernameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();
  TextEditingController adressController = TextEditingController();
  TextEditingController cityController = TextEditingController();
  TextEditingController countryController = TextEditingController();

  final storage = const FlutterSecureStorage();

  @override
  Widget build(BuildContext context) {
    Future<void> signUpUser() async {
      final res =
          await http.post(Uri.parse("http://$host:$thePort/users/post/users/"),
              headers: {"Content-Type": "application/json"},
              body: jsonEncode({
                "username": usernameController.text,
                "email": emailController.text,
                "password": passwordController.text,
                "confirmPassword": confirmPasswordController.text,
                "adress": adressController.text,
                "city": cityController.text,
                "country": countryController.text,
              }));

      if (res.statusCode == 201) {
        print(res.body);

        if (context.mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const LoginPage(),
            ),
          );
        }
      }
    }

    isConnect() async {
      String? token = await storage.read(key: "token");

      if (token != null) {
        if (context.mounted) {
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const HomePage()),
              (Route<dynamic> route) => false);
        }
      }
    }

    isConnect();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Inscription"),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Center(
            child: SizedBox(
              height: 500,
              width: 300,
              child: Container(
                decoration: const BoxDecoration(
                    color: Color.fromRGBO(217, 217, 217, 100),
                    borderRadius: BorderRadius.all(Radius.circular(10))),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Text("Nom d'utilisateur :"),
                    TextField(
                      style: const TextStyle(color: Colors.black),
                      decoration: const InputDecoration(
                          fillColor: Colors.white, filled: true),
                      controller: usernameController,
                    ),
                    const Text("Email :"),
                    TextField(
                      style: const TextStyle(color: Colors.black),
                      decoration: const InputDecoration(
                          fillColor: Colors.white, filled: true),
                      controller: emailController,
                    ),
                    const Text("Mot de passe :"),
                    TextField(
                      style: const TextStyle(color: Colors.black),
                      decoration: const InputDecoration(
                          fillColor: Colors.white, filled: true),
                      controller: passwordController,
                    ),
                    const Text("Confirmation mot de passe :"),
                    TextField(
                      style: const TextStyle(color: Colors.black),
                      decoration: const InputDecoration(
                          fillColor: Colors.white, filled: true),
                      controller: confirmPasswordController,
                    ),
                    const Text("Adresse :"),
                    TextField(
                      style: const TextStyle(color: Colors.black),
                      decoration: const InputDecoration(
                          fillColor: Colors.white, filled: true),
                      controller: adressController,
                    ),
                    const Text("Ville :"),
                    TextField(
                      style: const TextStyle(color: Colors.black),
                      decoration: const InputDecoration(
                          fillColor: Colors.white, filled: true),
                      controller: cityController,
                    ),
                    const Text("Pays :"),
                    TextField(
                      style: const TextStyle(color: Colors.black),
                      decoration: const InputDecoration(
                          fillColor: Colors.white, filled: true),
                      controller: countryController,
                    ),
                  ],
                ),
              ),
            ),
          ),
          ElevatedButton(
            onPressed: signUpUser,
            style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
            child: const Text(
              "Inscription",
              style:
                  TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  final storage = const FlutterSecureStorage();
  String? token = null;
  bool loged = false;

  @override
  Widget build(BuildContext context) {
    Future<void> signInUser() async {
      final res =
          await http.post(Uri.parse("http://$host:$thePort/users/login/users/"),
              headers: {"Content-Type": "application/json"},
              body: jsonEncode({
                "email": emailController.text,
                "password": passwordController.text,
              }));

      if (res.statusCode == 200) {
        Map<String, dynamic> decoded = json.decode(res.body);

        await storage.write(key: "token", value: decoded['token']);
        if (context.mounted) {
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const HomePage()),
              (Route<dynamic> route) => false);
        }
      }
    }

    isConnect() async {
      String? token = await storage.read(key: "token");

      if (token != null) {
        if (context.mounted) {
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const HomePage()),
              (Route<dynamic> route) => false);
        }
      }
    }

    isConnect();

    return Scaffold(
        appBar: AppBar(
          title: const Text(
            "Connexion",
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: Colors.black,
        ),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Center(
              child: SizedBox(
                height: 300,
                width: 300,
                child: Container(
                  decoration: const BoxDecoration(
                      color: Color.fromRGBO(217, 217, 217, 100),
                      borderRadius: BorderRadius.all(Radius.circular(10))),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const Text("Email :"),
                      TextField(
                        style: const TextStyle(color: Colors.black),
                        decoration: const InputDecoration(
                            fillColor: Colors.white, filled: true),
                        controller: emailController,
                      ),
                      const Text("Mot de passe :"),
                      TextField(
                        style: const TextStyle(color: Colors.black),
                        decoration: const InputDecoration(
                            fillColor: Colors.white, filled: true),
                        controller: passwordController,
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const RegisterPage()),
                          );
                        },
                        child: const Text("Pas de compte ? Inscrivez-vous."),
                      )
                    ],
                  ),
                ),
              ),
            ),
            ElevatedButton(
              onPressed: signInUser,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
              child: const Text(
                "Login",
                style:
                    TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            )
          ],
        ));
  }
}

class CategoryPage extends StatelessWidget {
  const CategoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Catégories",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.black,
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            height: 100,
            decoration: BoxDecoration(border: Border.all(color: Colors.black)),
            child: GestureDetector(
              child: Row(
                children: [
                  SizedBox(
                    height: 100,
                    width: 100,
                    child: Image.network(
                      "https://i.pinimg.com/564x/c9/12/a4/c912a4dd4a5612e606a893f3b65c688a.jpg",
                    ),
                  ),
                  const Text(
                    "Homme",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              onTap: () {
                Navigator.pushNamed(
                  context,
                  "/category/chaussures",
                  arguments: ScreenArguments(1),
                );
              },
            ),
          ),
          Container(
            width: double.infinity,
            height: 100,
            decoration: BoxDecoration(border: Border.all(color: Colors.black)),
            child: GestureDetector(
              child: Row(
                children: [
                  SizedBox(
                    height: 100,
                    width: 100,
                    child: Image.network(
                      "https://i.pinimg.com/564x/c1/01/09/c1010920254f64c3a2d05f4f504e5239.jpg",
                    ),
                  ),
                  const Text(
                    "Femme",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              onTap: () {
                Navigator.pushNamed(
                  context,
                  "/category/chaussures",
                  arguments: ScreenArguments(2),
                );
              },
            ),
          ),
          Container(
            width: double.infinity,
            height: 100,
            decoration: BoxDecoration(border: Border.all(color: Colors.black)),
            child: GestureDetector(
              child: Row(
                children: [
                  SizedBox(
                    height: 100,
                    width: 100,
                    child: Image.network(
                      "https://i.pinimg.com/564x/f5/23/70/f52370536db282da4e333180fe74ac11.jpg",
                    ),
                  ),
                  const Text(
                    "Mixte",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              onTap: () {
                Navigator.pushNamed(
                  context,
                  "/category/chaussures",
                  arguments: ScreenArguments(3),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class ShoesGenderPage extends StatefulWidget {
  const ShoesGenderPage({super.key});

  @override
  State<ShoesGenderPage> createState() => ShoesGenderPageState();
}

class ShoesGenderPageState extends State<ShoesGenderPage> {
  String theGender = "";

  Future<List<Shoes>> shoesFuture = fetchShoes();

  static Future<List<Shoes>> fetchShoes() async {
    final res = await http.get(
        Uri.parse("http://$host:$thePort/products/get/products/all/flutter/"),
        headers: {"Content-type": "application/json"});
    final List myRes = json.decode(res.body);
    return myRes.map((e) => Shoes.fromJson(e)).toList();
  }

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as ScreenArguments;

    setState(() {
      if (args.gender == 1) {
        theGender = "Homme";
      } else if (args.gender == 2) {
        theGender = "Femme";
      } else {
        theGender = "Mixte";
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Text(
          theGender == "Mixte"
              ? "Chaussures Mixte"
              : "Chaussures pour $theGender",
          style: const TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.black,
      ),
      body: Center(
          child: FutureBuilder<List<Shoes>>(
              future: shoesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                } else if (snapshot.hasData) {
                  final shoes = snapshot.data!;
                  return buildShoes(shoes);
                } else {
                  return const Text("Aucun produit");
                }
              })),
    );
  }

  Widget buildShoes(List<Shoes> shoes) {
    final args = ModalRoute.of(context)!.settings.arguments as ScreenArguments;

    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 792,
                width: double.infinity,
                child: ListView.builder(
                    itemCount: shoes.length,
                    itemBuilder: (context, index) {
                      final shoe = shoes[index];

                      if (shoe.gender == args.gender) {
                        return GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(
                                context,
                                "/category/chaussures/product",
                                arguments: TheIdShoes(shoe.pk as int),
                              );
                            },
                            child: Column(
                              children: [
                                Image.network(
                                  shoe.img!,
                                  height: 150,
                                  width: 150,
                                ),
                                Text(shoe.name!),
                                Text(shoe.price.toString())
                              ],
                            ));
                      } else {
                        return const Text("");
                      }
                    }),
              ),
            ),
          ],
        )
      ],
    );
  }
}

class TheShoesPage extends StatefulWidget {
  const TheShoesPage({super.key});

  @override
  State<TheShoesPage> createState() => TheShoesPageState();
}

class TheShoesPageState extends State<TheShoesPage> {

  int theIdUser = 0;
  void tokenDec() async {
    String? token = await storage.read(key: "token");

    if (token != null) {
      setState(() {
        theIdUser = jwt.JWT.decode(token as String).payload['id'];
      });
    }
  }

   
  

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as TheIdShoes;

    //tokenDec();

    Future<List<ShoesBis>> fetchTheShoes() async {
          final res = await http.get(
              Uri.parse(
                  "http://$host:$thePort/products/get/products/${args.idShoes}/"),
              headers: {"Content-type": "application/json"});

          final List myRes = jsonDecode(res.body);
          return myRes.map((e) => ShoesBis.fromJson(e)).toList();
        }
   

    Future<List<ShoesBis>> shoesFuture = fetchTheShoes();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text(
          "Article",
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: Center(
        child: FutureBuilder<List<ShoesBis>>(
            future: shoesFuture,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                final shoes = snapshot.data!;

                return buildShoes(shoes);
              } else if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              } else if (snapshot.hasError) {
                return Text('${snapshot.error}');
              } else {
                return const Text("no data");
              }
            }),
      ),
    );
  }
  final storage = const FlutterSecureStorage();


  

  Widget buildShoes(List<ShoesBis> shoes) {
//tokenDec();
    
    return Column(
      children: [
        Expanded(
          child: SizedBox(
            height: 2000,
            width: double.infinity,
            child: ListView.builder(
              itemCount: shoes.length,
              itemBuilder: (context, index) {
                final args = ModalRoute.of(context)!.settings.arguments as TheIdShoes;
                
                Future<void> newCommand() async {
                  
                  String? token = await storage.read(key: "token");
                  print(token);
                  print(theIdUser = jwt.JWT.decode(token as String).payload['id']);
                  final res = await http.post(
                      Uri.parse("http://$host:$thePort/commandes/post/commandes/"),
                      headers: {"Content-Type": "application/json"},
                      body: jsonEncode({
                        "isDelivred": false,
                        "isCommanded": true,
                        "product": args.idShoes,
                        "token": token,
                      }));
                    print(res.body);
                  if (res.statusCode == 201) {
                    print(res.body);

                    if (context.mounted) {
                      Navigator.pushNamed(context, "/shop");
                    }
                  }
                }

                final shoe = shoes[index];

                return Center(
                  child: Column(
                    children: [
                      Text(
                        shoe.name as String,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 25),
                      ),
                      Image.network(
                        shoe.img as String,
                        height: 250,
                        width: 250,
                      ),
                      Text("€ ${shoe.price}"),
                      Text(shoe.desc as String),
                      ElevatedButton(
                        onPressed: () {
                          newCommand();
                        },
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black),
                        child: const Text(
                          "Ajouter au panier",
                          style: TextStyle(color: Colors.white),
                        ),
                      )
                    ],
                  ),
                );
              },
            ),
          ),
        )
      ],
    );
  }
}

class TheIdShoes {
  final int idShoes;

  TheIdShoes(this.idShoes);
}

class ShopPage extends StatefulWidget {
  const ShopPage({super.key});

  @override
  State<ShopPage> createState() => ShopPageState();
}

class ShopPageState extends State<ShopPage> {
  final storage = const FlutterSecureStorage();

  bool loged = false;
  int? theUserId;

  void tokenDec() async {
    String? token = await storage.read(key: "token");

    if (token != null) {
      setState(() {
        theUserId = jwt.JWT.decode(token as String).payload['id'];
      });
    }
  }

  static Future<List<Commands>> fetchCommands() async {
    final res = await http.get(
        Uri.parse("http://$host:$thePort/commandes/get/commandes/all/"),
        headers: {"Content-type": "application/json"});

    final List myRes = json.decode(res.body);
    return myRes.map((e) => Commands.fromJson(e)).toList();
  }

  Future<List<Commands>> commandsFuture = fetchCommands();

  @override
  Widget build(BuildContext context) {
    void testtt() async {
      String? token = await storage.read(key: "token");
      if (token == null) {
        if (context.mounted) {
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const HomePage()),
              (Route<dynamic> route) => false);
        }
      }
    }

    testtt();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Panier", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.black,
      ),
      body: Center(
        child: FutureBuilder<List<Commands>>(
          future: commandsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const CircularProgressIndicator();
            } else if (snapshot.hasData) {
              final commands = snapshot.data!;
              return buildCommands(commands);
            } else {
              return const Text("no Data");
            }
          },
        ),
      ),
    );
  }

  Widget buildCommands(List<Commands> commands) {
    tokenDec();

    return Row(
      children: [
        Expanded(
          child: SizedBox(
            child: ListView.builder(
                itemCount: commands.length,
                itemBuilder: (context, index) {
                  final command = commands[index];
                  if (command.isDelivred == false &&
                      command.userId == theUserId) {
                    return Center(
                      child: Container(
                        decoration: BoxDecoration(
                            border: Border.all(color: Colors.black)),
                        child: Row(
                          children: [
                            SizedBox(
                              height: 100,
                              width: 100,
                              child: Image.network(
                                command.productImg as String,
                              ),
                            ),
                            Column(children: [
                              Text(command.productName.toString()),
                              Text("€ ${command.productPrice}")
                            ])
                          ],
                        ),
                      ),
                    );
                  } else {
                    return const Center();
                  }
                }),
          ),
        )
      ],
    );
  }
}

class MyNavigatorBar extends StatefulWidget {
  const MyNavigatorBar({super.key});

  @override
  State<MyNavigatorBar> createState() => MyNavigatorBarState();
}

class MyNavigatorBarState extends State<MyNavigatorBar> {
  final storage = const FlutterSecureStorage();

  bool loged = false;
  int valuee = 0;
  int load = 1;

  void testtt() async {
    String? token = await storage.read(key: "token");

    if (token != null) {
      setState(() {
        loged = true;
      });
    } else {
      setState(() {
        loged = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    testtt();

    return SizedBox(
        height: 100,
        child: Container(
          decoration: const BoxDecoration(color: Colors.black),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Text("$valuee"),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, "/");
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
                child: const Column(
                  children: [
                    Text("Home", style: TextStyle(color: Colors.white)),
                    Icon(Icons.home, color: Colors.white),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(
                    context,
                    "/category",
                  );
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
                child: const Column(
                  children: [
                    Text("Categorie", style: TextStyle(color: Colors.white)),
                    Icon(Icons.category, color: Colors.white),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  if (loged == false) {
                    Navigator.pushNamed(
                      context,
                      "/login",
                    );
                  } else {
                    storage.delete(key: "token");
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
                child: Column(
                  children: [
                    Text(loged == false ? "Login" : "Logout",
                        style: const TextStyle(color: Colors.white)),
                    Icon(loged == false ? Icons.login : Icons.logout,
                        color: Colors.white),
                  ],
                ),
              )
            ],
          ),
        ));
  }
}
