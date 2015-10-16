/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow.workflowUser;

import java.util.ArrayList;

/**
 * Created by steve on 10/14/15.
 */
public class Graph<T> {

    private ArrayList<T> vertexList;//存储点的链表
    private String[][] edges;//邻接矩阵，用来存储边
    private int numOfEdges;//边的数目

    public Graph(int n) {
        //初始化矩阵，一维数组，和边的数目
        edges=new String[n][n];
        vertexList=new ArrayList<T>(n);
        numOfEdges=0;
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                edges[i][j] = "0";
            }
        }
    }


    //得到结点的个数
    public int getNumOfVertex() {
        return vertexList.size();
    }

    //得到边的数目
    public int getNumOfEdges() {
        return numOfEdges;
    }

    //返回结点i的数据
    public T getValueByIndex(int i) {
        return vertexList.get(i);
    }

    //返回v1,v2的权值
    public String getWeight(int v1,int v2) {
        return edges[v1][v2];
    }

    //插入结点
    public void insertVertex(T vertex) {
        vertexList.add(vertexList.size(),vertex);
    }

    //插入结点
    public void insertEdge(int v1,int v2,String weight) {
        edges[v1][v2]=weight;
        numOfEdges++;
    }

    //删除结点
    public void deleteEdge(int v1,int v2) {
        edges[v1][v2]="0";
        numOfEdges--;
    }

    //得到第一个邻接结点的下标
    public int getFirstNeighbor(int index) {
        for(int j=0;j<vertexList.size();j++) {
            if (!edges[index][j].equals("0")) {
                return j;
            }
        }
        return -1;
    }

    //根据前一个邻接结点的下标来取得下一个邻接结点
    public int getNextNeighbor(int v1,int v2) {
        for (int j=v2+1;j<vertexList.size();j++) {
            if (!edges[v1][j].equals("0")) {
                return j;
            }
        }
        return -1;
    }
}
