name := "cueService"

version := "0.1"

scalaVersion := "2.12.8"
scalacOptions += "-Ypartial-unification"


val circeVersion = "0.11.1"

libraryDependencies ++= Seq(
  "org.typelevel" %% "cats-core" % "1.6.1",

  "com.typesafe.akka" %% "akka-http"   % "10.1.8",
  "com.typesafe.akka" %% "akka-stream" % "2.5.23",

  "org.sangria-graphql" %% "sangria" % "1.4.2",
  "org.sangria-graphql" %% "sangria-slowlog" % "0.1.8",

  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-optics" % "0.11.0",

  "de.heikoseeberger" %% "akka-http-circe" % "1.27.0",
  "org.sangria-graphql" %% "sangria-circe" % "1.2.1",

  "org.postgresql" % "postgresql" % "42.2.6",
  "io.getquill" %% "quill-sql" % "3.2.2",
  "io.getquill" %% "quill-jdbc" % "3.2.2",

  "com.typesafe.akka" %% "akka-slf4j" % "2.5.23",
  "ch.qos.logback" % "logback-classic" % "1.2.3",

  "com.kosprov.jargon2" % "jargon2-api" % "1.1.1",
)

enablePlugins(FlywayPlugin)


flywayUrl := "jdbc:postgresql://localhost/cueDev"
flywayUser := "brudil"
flywayPassword := ""
flywayLocations += "db/migration"
flywayUrl := "jdbc:postgresql://localhost/cueDev"
flywayUser in Test := ""
flywayPassword in Test := ""
