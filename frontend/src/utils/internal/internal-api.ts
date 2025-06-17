import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

const API_URL = 'http://localhost:3001';

export async function fetchInternalApi(req: NextRequest): Promise<Response> {
    try {
      const urlPath = new URL(req.url).pathname;
      const queryParams = new URL(req.url).searchParams;
      const url = `${API_URL}${urlPath}?${queryParams}`;
      const body = req.method !== "GET" && req.method !== "DELETE" ? await req.json(): undefined;
      const response = await axios({
        method: req.method,
        url: url,
        data: body,
        headers: {
        'Content-Type': 'application/json',
        },
      });
      return NextResponse.json(response.data);
    } catch (e) {
        if (e instanceof AxiosError) {
            return NextResponse.json(e.response?.data, {
                status: e.response?.status || 500,
            });
        }
        console.error("[fetchInternalApiUseAuth] catch:", e);
        const responseError = {
        code: "error",
        message: "Internal Server Error: ",
        data: null,
        };
        return NextResponse.json(responseError, { status: 500 });
    }
  }
  