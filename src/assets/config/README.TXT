Each image from the images.json file has the following properties:

"imageURL" : the path to the image location
"target" : one of the following four:
	"_blank" - opens the link in a new browser page
	"_self" - opens the link in the same browser page
	"lightbox" - opens the link as a bigger image, the rest of the window being dimmed out
	"none" - no action on image click
"link" : one of the following two
	- the address to go on image click when "target" is set to "_blank" or "_self"
	- the path of the image to open when "target" is set to "lightbox"
"text" : (optional) the text that appears over the image
"lightboxCaption" : (optional) the text that appears below the bigger image when "target" is set to "lightbox"