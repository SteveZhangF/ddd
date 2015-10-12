SELECT  *  FROM `osha`.`CSTBL_18`
<#if entity.columnAttributes?exists>
<#if foreignMap?exists>
    <#list foreignMap?keys as key>
    <#if key_index==0>WHERE
    </#if>
    ${value} = ${foreignMap.get(key)}
    `${key}` = `${value}`
    <#if key_has_next>
    ,
    </#if>
    </#list>
</#if>
</#if>

