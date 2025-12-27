package lk.cypher.bookly.annotation;

import jakarta.ws.rs.NameBinding;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@NameBinding // This annotation can be used to bind filters or interceptors to specific resource methods or classes.
@Retention(RetentionPolicy.RUNTIME) // Defines how long the annotation information is to be retained.
@Target({ElementType.TYPE, ElementType.METHOD}) // Where the annotation can be applied (classes, methods or constructors).
public @interface IsUser {}
