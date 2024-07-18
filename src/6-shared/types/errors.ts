import { NextResponse } from "next/server"

export type ErrorJSON = {
  error: string
}

export class NextErrorResponse extends NextResponse {
  constructor(error: ErrorJSON, init?: ResponseInit) {
    super(JSON.stringify(error), init)
  }
}
