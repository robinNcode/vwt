package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/robinncode/vwt/internal/server/response"
	"github.com/robinncode/vwt/internal/model"
	"github.com/robinncode/vwt/internal/service"
)

type RoleHandler struct {
	svc service.RoleService
}

func NewRoleHandler(svc service.RoleService) *RoleHandler {
	return &RoleHandler{svc: svc}
}

func (h *RoleHandler) List(c *gin.Context) {
	roles, err := h.svc.ListRoles()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch roles", err.Error())
		return
	}
	response.OK(c, "Roles fetched successfully", roles)
}

func (h *RoleHandler) ListPermissions(c *gin.Context) {
	perms, err := h.svc.ListPermissions()
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to fetch permissions", err.Error())
		return
	}
	response.OK(c, "Permissions fetched successfully", perms)
}

type permUpdateReq struct {
	PermissionIDs []uint `json:"permission_ids"`
}

func (h *RoleHandler) UpdatePermissions(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var req permUpdateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	if err := h.svc.UpdateRolePermissions(uint(id), req.PermissionIDs); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to update permissions", err.Error())
		return
	}
	response.OK(c, "Permissions updated successfully", nil)
}

type roleUpsertReq struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
}

func (h *RoleHandler) Create(c *gin.Context) {
	var req roleUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}
	role := model.Role{Name: req.Name, Slug: req.Slug}
	if err := h.svc.CreateRole(&role); err != nil {
		response.Fail(c, http.StatusInternalServerError, "Failed to create role", err.Error())
		return
	}
	response.Created(c, "Role created successfully", role)
}
