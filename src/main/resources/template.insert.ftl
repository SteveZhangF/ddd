INSERT INTO `osha`.`CSTBL_${entity.id}`

<#if entity.columnAttributes?exists>
(
    <#list entity.columnAttributes as attr>
    <#if attr.plugins=="macros">
        ${attr.orgtype}
    <#else>
        ${attr.column_Name}
    </#if>
    <#if attr_has_next>,</#if>
    </#list>
)
VALUES
(
<#list entity.columnAttributes as attr>
    <#if attr.plugins=="macros">:${attr.orgtype}
    <#else>
    :${attr.column_Name}
    </#if>
    <#if attr_has_next>,</#if></#list>
);
</#if>

