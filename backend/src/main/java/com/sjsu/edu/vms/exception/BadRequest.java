package com.sjsu.edu.vms.exception;

public class BadRequest {

    public BadRequest() {
    }

    public BadRequest(String code, String msg) {
        this.msg = msg;
        this.code = code;
    }

    private String msg;
    private String code;

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "BadRequest [code=" + code + ", msg=" + msg + "]";
    }
}
