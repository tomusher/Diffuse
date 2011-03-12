from django import template

register = template.Library()

#active tag by nivhab: http://stackoverflow.com/questions/340888/navigation-in-django/656328#656328
@register.tag
def active(parser, token):
    import re
    nodelist = parser.parse(('endactive',))
    parser.delete_first_token()
    args = token.split_contents()
    template_tag = args[0]
    if len(args) < 2:
        raise template.TemplateSyntaxError, "%r tag requires at least one argument" % template_tag
    return NavSelectedNode(args[1:], nodelist)

class NavSelectedNode(template.Node):
    def __init__(self, patterns, nodelist):
        self.patterns = patterns
        self.nodelist = nodelist
    def render(self, context):
        path = context['request'].path
        for p in self.patterns:
            pValue = template.Variable(p).resolve(context)
            if str(pValue) in path:
                return self.nodelist.render(context)
        return ""
