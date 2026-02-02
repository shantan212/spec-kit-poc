package com.specit.productlist.api.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    
    private final String email;
    
    public EmailAlreadyExistsException(String email) {
        super("A user with email '" + email + "' already exists");
        this.email = email;
    }
    
    public String getEmail() {
        return email;
    }
}
