package com.withcue.service

import com.withcue.service.AccountRepo.Account
import sangria.schema._

object BoxSchema {
  val Obj = InterfaceType(
    "Object",
    "A generic object within the graph",
    () =>
      fields[Any, Model](
        Field("id", LongType, Some("The object's ID"), resolve = _.value.id)
    )
  )

  val Account = ObjectType(
    "Account",
    "A Cue account",
    () => fields[Any, Account]()
  )
}
