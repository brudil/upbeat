package com.withcue.service

import io.getquill._

trait Model {
  def id: Long
  def createdAt: String
  def updatedAt: String
}

trait Repo {
  lazy val ctx = new PostgresJdbcContext(CamelCase, "ctx")
}

object AccountRepo extends Repo {
  import ctx._

  case class Account(id: Long, createdAt: String, updatedAt: String, name: String, emailAddress: String) extends Model

  val accounts: ctx.Quoted[ctx.EntityQuery[Account]] = quote {
    querySchema[Account]("accounts")
  }

  def findById(id: Long) = quote {
    accounts.filter(_.id == lift(id))
  }

  def find(id: Long) = {
    ctx.run(findById(id))
  }

  def createUser() = {
    transaction {
      val q = quote {
        accounts
          .insert(_.name -> lift("Hello there"), _.emailAddress -> "james@brudil.com")
          .returning(_.id)
      }
      val id = ctx.run(q)

      val usr = ctx.run(findById(id))

      usr
    }

  }
}
