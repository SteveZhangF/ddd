<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-mapping
        PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
        "http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">

<hibernate-mapping>
    <class
            name="${entity.form_name}"
            table="${entity.form_name}"
            dynamic-update="false"
            dynamic-insert="false"
            select-before-update="false"
            optimistic-lock="version">
        <id
                name="id"
                column="ID"
                type="long"
                unsaved-value="null">
            <generator class="native"/>
        </id>
        <one-to-one name="user" class="app.model.user.User" cascade="all"></one-to-one>
    <#if entity.columnAttributes?exists>
        <#list entity.columnAttributes as attr>
            <#if attr.column_Name == "id">
            <#elseif attr.column_type=="string">
                <property
                        name="${attr.column_Name}"
                        type="java.lang.String"
                        update="true"
                        insert="true"
                        access="property"
                        column="${attr.column_Name}"
                        length="${attr.length}"
                        not-null="false"
                        unique="false"
                        />
            <#else>
                <property
                        name="${attr.name}"
                        type="${attr.column_type}"
                        update="true"
                        insert="true"
                        access="property"
                        column="`${attr.column_Name}`"
                        not-null="false"
                        unique="false"
                        />

            </#if>
        </#list>
    </#if>
    </class>
</hibernate-mapping>